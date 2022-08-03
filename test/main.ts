import "dotenv/config"

import { Tests } from "./Tests"

const main = async (): Promise<any> => {
    const tests = new Tests()
    await tests.test("image.create")
}

(async () => {
    main()
        .then((res) => {
            if (res) { console.log(res) }
            process.exit(0)
        })
        .catch((error) => {
            if (error) { console.error(error) }
            process.exit(1)
        })
})()
