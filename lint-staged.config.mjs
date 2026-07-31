export default {
  "*.{js,jsx,ts,tsx,mjs,cjs}": [
    "eslint --fix --max-warnings=0",
    "prettier --write",
  ],
  "*.{json,md,mdx,yml,yaml,css,scss,html}": "prettier --write",
};
