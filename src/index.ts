/**
 * 受け取った値を出力する
 * @param text
 * @param breakLine
 */
const printLine = (text: string, breakLine: boolean = true) => {
    process.stdout.write(text + (breakLine ? '\n' : ''));
}

/**
 * ユーザへ質問を投げかけ、入力された値を返す
 * @param text 
 * @returns 
 */
const promptInput = async (text: string) => {
    printLine(`\n${text}\n `, false);
    const input: string = await new Promise((resolve) => process.stdin.once('data', (data) => {
        resolve(data.toString());
    }));
    return input.trim();
}

(async () => {
    const name = await promptInput('名前を入力してください');
    console.log(name);
    const age = await promptInput('年齢を入力してください');
    console.log(age);
    process.exit();
})();