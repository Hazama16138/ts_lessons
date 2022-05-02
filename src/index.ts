type Mode = 'normal' | 'hard';

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

/**
 * HitAndBlowクラス
 */
class HitAndBlow {
    // 回答の選択肢となりえる文字列の配列
    private readonly answerSource = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    // 回答の文字列
    private answer: string[] = [];
    // 試行回数の数値
    private tryCount = 0;
    // ゲームの難易度
    private readonly mode: Mode;

    /**
     * 初期設定
     * @param mode
     */
    constructor(mode: Mode) {
        this.mode = mode;
    }

    /**
     * ゲームの初期設定
     */
    public setting() {
        // 回答の値の数
        const answerLength = this.getAnswerLength();

        // 回答の値をランダムに生成する
        while (this.answer.length < answerLength) {
            const randNum = Math.floor(Math.random() * this.answerSource.length);
            const selectedItem = this.answerSource[randNum];
            // 重複しない文字列を配列に格納する
            if (!this.answer.includes(selectedItem)) {
                this.answer.push(selectedItem);
            }
        }
    }

    /**
     * ゲーム実行処理
     */
    public async play() {
        const answerLength = this.getAnswerLength();
        const inputArr = (await promptInput(`「,」区切りで${answerLength}つの数字を入力してください`)).split(',');

        // バリデーションチェック
        if (!this.validate(inputArr)) {
            printLine('無効な入力です。');
            await this.play();
            return;
        }

        // hitとblowの数を判定
        const result = this.check(inputArr);

        if (result.hit !== this.answer.length) {
            // 不正解だったら続ける
            printLine(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n---`);
            this.tryCount += 1;
            await this.play();
        } else {
            // 正解だったら終了
            this.tryCount += 1;
        }
    }

    /**
     * ゲーム終了
     */
    public end() {
        printLine(`正解です！\n試行回数: ${this.tryCount}回`);
        process.exit();
    }

    /**
     * ユーザが入力した値のhitとblowを判定
     * @param input 
     * @returns 
     */
    private check(input: string[]) {
        let hitCount = 0;
        let blowCount = 0;

        input.forEach((val, index) => {
            if (val === this.answer[index]) {
                hitCount += 1;
            } else if (this.answer.includes(val)) {
                blowCount += 1;
            }
        });

        return {
            hit: hitCount,
            blow: blowCount,
        }
    }

    /**
     * バリデーションチェック
     * @param inputArr
     * @private
     */
    private validate(inputArr: string[]) {
        // 文字列の数が正しければtrue
        const isLengthValid = inputArr.length === this.answer.length;
        // 選択可能な文字列であればtrue
        const isAllAnswerSourceOption = inputArr.every((val) => this.answerSource.includes(val));
        // 重複がなければtrue
        const isAllDifferentValues = inputArr.every((val, i) => inputArr.indexOf(val) === i);
        return isLengthValid && isAllAnswerSourceOption && isAllDifferentValues;
    }

    /**
     * 難易度に応じて、正解の値の個数を返す
     * @private
     */
    private getAnswerLength() {
        switch (this.mode) {
            case 'normal':
                return 3;
            case 'hard':
                return 4;
            default:
                throw new Error(`${this.mode} は無効なモードです。`);
        }
    }
}

/**
 * 実行処理
 */
(async () => {
    const hitAndBlow = new HitAndBlow('hard');
    hitAndBlow.setting();
    await hitAndBlow.play();
    hitAndBlow.end();
})();