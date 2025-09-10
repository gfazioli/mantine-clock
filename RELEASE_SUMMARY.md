# Release Summary for v2.1.1

## Comparison: v2.1.0 → v2.1.1

### Changes Made

**Package Version:**
- Version bump: `2.1.0` → `2.1.1`

**Dependency Updates:**
- `@mantine/core`: `8.3.0` → `8.3.1`
- `@mantine/hooks`: `8.3.0` → `8.3.1` 
- `@mantine/code-highlight`: `8.3.0` → `8.3.1`
- `@mantine/dates`: `8.3.0` → `8.3.1`

**Files Modified:**
- `/package/package.json` - Version bump and peer dependency updates
- `/package.json` - Dev dependency updates
- `/docs/package.json` - Documentation dependency updates
- `/yarn.lock` - Lockfile updates for new dependency versions

### Release Type
**Patch Release** - Maintenance update with dependency upgrades for compatibility and security.

## Recommended Commit Message (GitMoji)

```
⬆️ chore(deps): update mantine dependencies to 8.3.1

- Update @mantine/core from 8.3.0 to 8.3.1
- Update @mantine/hooks from 8.3.0 to 8.3.1  
- Update @mantine/code-highlight from 8.3.0 to 8.3.1
- Update @mantine/dates from 8.3.0 to 8.3.1
- Bump package version to 2.1.1
- Synchronize dependency versions across workspace packages

Fixes compatibility with latest Mantine release
```

### Alternative Commit Messages

**Short version:**
```
⬆️ update mantine deps to 8.3.1 and bump to v2.1.1
```

**With multiple emojis:**
```
⬆️📦 chore: update mantine dependencies and release v2.1.1

✨ Updated @mantine/* packages to 8.3.1
🔧 Synchronized workspace dependency versions
📌 Bumped package version to 2.1.1
```

### GitMoji Reference Used
- ⬆️ `:arrow_up:` - Upgrade dependencies
- 📦 `:package:` - Add or update compiled files or packages
- 🔧 `:wrench:` - Add or update configuration files
- 📌 `:pushpin:` - Pin dependencies to specific versions