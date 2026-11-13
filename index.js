// dsh-humanizer-zh — DSH plugin: registers the humanizer-zh skill for Chinese text humanization.
// Reads the bundled SKILL.md and serves it through ctx.skills.
// Named exports only. Do not add `export default`: the dsh loader prefers it and drops inject / Config.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const SKILL_DIR = fileURLToPath(new URL('skills/humanizer-zh/', import.meta.url));
const SKILL_FILE = fileURLToPath(new URL('skills/humanizer-zh/SKILL.md', import.meta.url));

export const name = 'dsh-humanizer-zh';

/**
 * Parse simple YAML frontmatter from a markdown file.
 * Returns { meta, body } where meta is a flat key-value object.
 */
function splitSkill(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u.exec(text);
  if (!m) throw new Error('SKILL.md is missing frontmatter');
  const meta = {};
  for (const line of m[1].split(/\r?\n/u)) {
    const kv = /^([A-Za-z-]+):\s*(.*)$/u.exec(line);
    if (kv) {
      meta[kv[1]] = kv[2].replace(/^(['"])(.*)\1$/u, '$2');
    }
  }
  return { meta, body: text.slice(m[0].length) };
}

export function apply(ctx) {
  // Register a skill provider so humanizer-zh appears in the skill catalog
  ctx.inject(['skills'], (sctx) => {
    sctx.skills.registerProvider(() => ({
      name: 'dsh-humanizer-zh',

      async list() {
        const raw = await readFile(SKILL_FILE, 'utf8');
        const { meta } = splitSkill(raw);
        return [{
          name: meta.name || 'humanizer-zh',
          description: meta.description || '中文文本去 AI 痕迹综合技能',
          invocation: { modelInvocable: true, userInvocable: true },
          provider: 'dsh-humanizer-zh',
          source: 'bundled',
          rank: 600,
          resourceBase: { kind: 'directory', path: SKILL_DIR },
          locator: SKILL_FILE,
        }];
      },

      async get(candidate) {
        const raw = await readFile(SKILL_FILE, 'utf8');
        const { body } = splitSkill(raw);
        return {
          name: candidate.name,
          description: candidate.description,
          invocation: candidate.invocation,
          provider: candidate.provider,
          source: candidate.source,
          resourceBase: candidate.resourceBase,
          content: body,
        };
      },
    }));
  });
}