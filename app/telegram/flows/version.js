import fs from 'fs'
import path from 'path'

const packageJsonPath = path.join(process.cwd(), 'package.json')
const packageJson = JSON.parse(
  fs.readFileSync(packageJsonPath, { encoding: 'utf-8' })
)

export function versionCommand() {
  return async (context) => {
    const { localize } = context.state

    await context.reply(
      localize('version', {
        version: packageJson.version,
        chatId: context.chat.id,
        fromId: context.from.id,
      }),
      { parse_mode: 'MarkdownV2' }
    )
  }
}
