# quip-rip

Downloads all of one's Quip folders and documents.

...because some of us have 366 of them.

## Usage

1. Install [io.js](https://iojs.org/en/index.html)

2. Clone this repository.

3. Generate a [Quip Personal Token](https://quip.com/api/personal-token) and add it in config.json

4. Download All

```bash
 $ node quip.js     # go make a coffee
 
 # errors are printed if you hit Quip's API rate limit
 # but it will get them at the end
```

5. Run Markdown Converter

```bash
 $ node_modules/html-md/bin/htmlmd -o quip-md/ quip/*
```

**Freedom!**
