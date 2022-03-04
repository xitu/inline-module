module.exports = {
    preset: 'jest-puppeteer',
    globals: {
        URL: 'http://localhost:8080',
    },
    verbose: true,
    coveragePathIgnorePatterns: [
        "/node_modules/", // 这个目录的内容是不用 jest 处理的
        "/.test/",
    ]
};
