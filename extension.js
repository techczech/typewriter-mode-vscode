/**
 * @file The main file that runs the extension.
 * @author Mikey Lau
 * {@link https//mikeylau.uk|Portfolio}
 * {@link https://github.com/MikeyJL|Github}
 * @version 1.0
 */

const vscode = require('vscode')

/**
 * Runs once when the extension is activated.
 * @param {vscode.ExtensionContext} context - The extension context.
 */
function activate (context) {
  const config = vscode.workspace.getConfiguration('typewriterAutoScroll')
  const enable = config.get('enable')
  const offset = config.get('offset')
  context.subscriptions.push(new TypewriterAutoScroll(enable, offset, context))
}

/**
 * Runs once when the extension is deactivated.
 */
function deactivate () {}

/**
 * @class Typewriter controller.
 */
class TypewriterAutoScroll {
  /**
   * The state of the typewriter extension.
   * @param {boolean} enable - Whether the extension is enabled.
   */
  constructor (enable, offset, context) {
    this.enable = enable
    this.offset = offset
    this.subscriptions = []
    if (!this.statusBar) {
      this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
    }

    const editor = vscode.window.activeTextEditor
    if (!editor) {
      this.statusBar.hide()
    } else {
      if (enable) {
        this.statusBar.text = 'Typewriter ON'
      } else {
        this.statusBar.text = 'Typewriter OFF'
      }
      this.statusBar.show()
    }

    const toggleDisposable = vscode.commands.registerCommand('toggleTypewriter', () => {
      this.toggleEnable()
    })
    const offsetDisposable = vscode.commands.registerCommand('changeTypewriterOffset', () => {
      this.changeOffset()
    })
    this.subscriptions.push(
      toggleDisposable,
      offsetDisposable,
      vscode.workspace.onDidChangeConfiguration(this.onConfigurationChange, this),
      vscode.window.onDidChangeTextEditorSelection(this.onSelectionChange, this)
    )
    context.subscriptions.push(...this.subscriptions)
  }

  /**
   * Toggles the state of the typewriter auto-scroll.
   */
  toggleEnable () {
    this.enable = !this.enable

    const configuration = vscode.workspace.getConfiguration('typewriterAutoScroll')
    configuration.update('enable', this.enable)
    if (this.enable) {
      vscode.window.showInformationMessage('Typewriter: toggled on!')
      this.statusBar.text = 'Typewriter ON'
    } else {
      vscode.window.showInformationMessage('Typewriter: toggled off!')
      this.statusBar.text = 'Typewriter OFF'
    }
    this.statusBar.show()
  }

  async changeOffset () {
    const newOffset = await vscode.window.showInputBox({
      title: 'Specify a new offset from the centered/focused line'
    })
    if (newOffset === undefined) {
      return
    }
    const parsedOffset = Number.parseInt(newOffset, 10)
    if (Number.isNaN(parsedOffset)) {
      vscode.window.showErrorMessage('Typewriter: offset must be an integer')
      return
    }
    this.offset = parsedOffset
    const configuration = vscode.workspace.getConfiguration('typewriterAutoScroll')
    configuration.update('offset', parsedOffset)
    vscode.window.showInformationMessage(`Typewriter: changed offset to ${parsedOffset}`)
  }

  /**
   * Centers the viewport onto the focused line when typewriter auto-scroll is enabled.
   */
  onSelectionChange (instance) {
    if (!this.enable || instance.kind === vscode.TextEditorSelectionChangeKind.Mouse) {
      return
    }
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }
    const selection = editor.selection
    const centerScrollPosition = new vscode.Position(selection.active.line + this.offset, selection.active.character)
    const range = new vscode.Range(centerScrollPosition, centerScrollPosition)
    editor.revealRange(range, vscode.TextEditorRevealType.InCenter)
  }

  /**
   * Updates the status and enabled state from the extension settings.
   */
  onConfigurationChange () {
    const configuration = vscode.workspace.getConfiguration('typewriterAutoScroll')
    if (configuration.get('enable')) {
      this.enable = true
      this.statusBar.text = 'Typewriter ON'
    } else {
      this.enable = false
      this.statusBar.text = 'Typewriter OFF'
    }
    this.offset = configuration.get('offset')
    this.statusBar.show()
  }

  dispose () {
    if (this.statusBar) {
      this.statusBar.dispose()
    }
    this.subscriptions.forEach(subscription => subscription.dispose())
  }
}

module.exports = {
  activate,
  deactivate
}
