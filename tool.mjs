import fs from "fs"
import axios from "axios"
import puppeteer from "puppeteer"

const UPPERCASE = fs.readFileSync("./UPPERCASE.doc", "utf-8").split("\r\n")
const lowercase = fs.readFileSync("./lowercase.doc", "utf-8").split("\r\n")
const listBank = fs.readFileSync("./listBank.doc", "utf-8").split("\r\n")
let run = true
let countUpperCase = 0;
let countLowerCase = 0;
let countListBank = 0;
let browser;
class Account {
    userName
    passWord
    bankNumber
    trueName
    constructor() {
        this.userName = lowercase[countLowerCase]
        this.passWord = "123456hg"
        this.trueName = UPPERCASE[countUpperCase]
        this.bankNumber = listBank[countListBank]
        countListBank++
        countUpperCase++
        countLowerCase++
    }
}


async function main() {
    try {
        let captchaCode
        run = false
        browser = await puppeteer.launch({
            headless: false
        })

        const page1 = await browser.newPage()
        await page1.setViewport({ width: 1600, height: 900 })
        await page1.goto("https://37go99.com/Register")
        await page1.waitForSelector('span[translate="Common_Closed"]')
        await page1.click('span[translate="Common_Closed"]');
        const account = new Account()
        console.log(account);
        await page1.waitForTimeout(1000)
        await page1.type('input.form-control.ng-pristine.ng-untouched.ng-valid.ng-empty[placeholder="Từ 2-15 kí tự, phải bắt đầu bằng chữ cái, có thể  gồm cả chữ cái, số và gạch dưới."][ng-model="$ctrl.user.account.value"][ng-blur="$ctrl.user.account.validate()"]', account.userName)
        await page1.type(`input.form-control.ng-pristine.ng-untouched.ng-valid.ng-empty[type="password"][placeholder="Hơn 6 ký tự phải bao gồm chữ cái và số"][ng-model="$ctrl.user.password.value"][ng-blur="$ctrl.user.password.validate()"][ng-change="$ctrl.user.checkPasswordStrength()"]`, account.passWord)
        await page1.type(`input.form-control.ng-pristine.ng-untouched.ng-valid.ng-empty[type="password"][placeholder="Vui lòng xác nhận lại mật khẩu của bạn"][ng-model="$ctrl.user.confirmPassword.value"][ng-blur="$ctrl.user.confirmPassword.validate()"]`, account.passWord)
        await page1.type(`input.form-control.ng-pristine.ng-untouched.ng-valid.ng-empty[type="password"][placeholder="Vui Lòng Nhập Mật Khẩu Rút Tiền"][ng-model="$ctrl.user.moneyPassword.value"]`, account.passWord)
        await page1.type(`input.form-control.ng-pristine.ng-untouched.ng-valid.ng-empty[type="text"][placeholder="Họ và tên đầy đủ, chữ in hoa không dấu , có dấu cách (VD: NNNN XXX YY ). Họ và tên thật phải trùng với tên thật trên thẻ ngân hàng đã liên kết."][ng-model="$ctrl.user.name.value"][ng-blur="$ctrl.user.name.validate()"]`, account.trueName)
        await page1.click(`input.form-control.ng-pristine.ng-untouched.ng-empty.ng-invalid.ng-invalid-required[type="text"][placeholder="Mã xác minh"][required=""][ng-model="$ctrl.code"][ng-focus="$ctrl.captchaFocus()"][ng-mousedown="$ctrl.captchaFocus()"][ng-change="$ctrl.codeChange()"]`)
        await page1.waitForTimeout(2000)

        let imgSrc = await page1.$eval('img._3MSK6A03OPsM8LoNU-b9qF', img => img.getAttribute('src'));
        imgSrc = imgSrc.toString().replace('data:image/png;base64,', '')//base64

        const data = new URLSearchParams();
        data.append('method', 'base64');
        data.append('key', "d1448890138e20f62555edafc3c33cb5");
        data.append('body', imgSrc);
        const apiKey = "d1448890138e20f62555edafc3c33cb5"
        await axios.post('https://2captcha.com/in.php', data)
            .then((res) => {
                const checkUrl = `https://2captcha.com/res.php?key=${apiKey}&action=get&id=${Number(res.data.replace('OK|', ''))}`;
                setTimeout(() => {
                    axios.get(checkUrl)
                        .then((res) => {
                            captchaCode = res.data.replace('OK|', '')//captchaCode
                            console.log(captchaCode);
                        })
                }, 8000)
            })
        await page1.waitForTimeout(9000)
        await page1.type('input.form-control.ng-pristine.ng-untouched.ng-empty.ng-invalid.ng-invalid-required[type="text"][placeholder="Mã xác minh"][required=""][ng-model="$ctrl.code"][ng-focus="$ctrl.captchaFocus()"][ng-mousedown="$ctrl.captchaFocus()"][ng-change="$ctrl.codeChange()"]', `${captchaCode}`)
        await page1.click('button.btn.btn-default._1SkHEsu5miBpcpNXUNtIoM[type="submit"][ng-class="$ctrl.styles.submit"][ng-disabled="$ctrl.registerPending"]')
        try {
            await page1.waitForTimeout(4000)
            await page1.click('button._1Zpq-Tk-JBGDiQA5p9djC3[type="button"][ng-class="$ctrl.styles.dismiss"][ng-click="$ctrl.dismiss()"]')
            fs.appendFileSync("./res.txt", `${JSON.stringify(account, 4)} dăng ký thành công \t`)
        } catch (error) {
            throw new Error(error)
        }
        await page1.waitForTimeout(3000)
        await page1.click('button.btn.btn-link[type="button"][ng-click="$ctrl.ok()"] > i.far.fa-times-circle')
        await page1.click('span.ng-scope[translate="Shared_Online_Deposit"]')
        const page2 = await browser.newPage()
        await page2.setViewport({ width: 1600, height: 900 })
        await page2.goto('https://37go99.com/WithdrawApplication')
        //await page2.click('a[ui-sref="withdraw"][href="/WithdrawApplication"] > i.fas.fa-hand-holding-usd + span.ng-scope[translate="MemberCenter_Withdraw"]')
        await page2.waitForTimeout(5000)
        await page2.click(`button.form-control._1kNqYr72mGtT0HQPYDnBrF[type="button"][ng-class="$ctrl.styles['btn-bank']"][ng-click="$ctrl.viewModel.onBankNameChange()"] > span.ng-scope[translate="WithdrawApplication_BankNameNotEmpty"] + i.fas.fa-chevron-down.dropdown-arrow`)
        await page2.type('input[type="search"][ng-model="$ctrl.viewModel.searchFilter"][ng-change="$ctrl.viewModel.search()"][placeholder="Vui lòng chọn ngân hàng"].ng-pristine.ng-untouched.ng-valid.ng-empty', 'VPBANK')
        await page2.waitForTimeout(200)
        await page2.click('a[role="menuitem"][ng-click="$ctrl.viewModel.selectBankName(item)"].ng-binding')
        await page2.type(`input.form-control.ng-pristine.ng-untouched.ng-valid.ng-empty[type="text"][placeholder="ví dụ : thành phố hồ chí minh"][ng-model="$ctrl.viewModel.bankAccountForm.city.value"][ng-change="$ctrl.viewModel.bankAccountForm.onCityChanged()"][uib-tooltip-template="'ngTemplateCityInvalid'"][tooltip-is-open="$ctrl.viewModel.bankAccountForm.city.invalid"][tooltip-trigger="'none'"]`, "HA NOI")
        await page2.type(`input.form-control.ng-pristine.ng-untouched.ng-valid.ng-empty[type="text"][placeholder="ví dụ：6227002020690175526"][ng-model="$ctrl.viewModel.bankAccountForm.account.value"][ng-change="$ctrl.viewModel.bankAccountForm.onAccountChanged()"][uib-tooltip-template="'ngTemplateAccountInvalid'"][tooltip-is-open="$ctrl.viewModel.bankAccountForm.account.invalid"][tooltip-trigger="'none'"]`, account.bankNumber)
        try {
            await page2.click(`button.btn.btn-default.btn-lg.ng-scope[type="submit"][translate="Shared_Submit"][ng-disabled="!$ctrl.viewModel.bankAccountForm.bankName.value"]`)
            fs.appendFileSync("./res.txt", `-----liên kết bank thành công ---- \n`)
        } catch (error) {
            fs.appendFileSync("./res.txt", `liên kết bank thất bại \n`)
        }

        await browser.close()
        run = true
    } catch (e) {
        throw new Error(e)
    }

}


async function excute() {
    while (run) {
        try {
            await main()
        } catch (e) {
            console.log(e)
            run = true
            await browser.close()
            await excute()
            return
        }
    }
}


excute()
