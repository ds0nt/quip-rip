# quip-rip

Download all Folders and Documents from Quip and Convert Docs to Markdown

## Usage

1. Install [io.js](https://iojs.org/en/index.html)

2. Clone this repository.

Generate a [Quip Personal Token](https://quip.com/api/personal-token) and add it in config.json

Download Quip Docs (as HTML)

```bash
 $ node quip.js     # go make a coffee
 
 # errors are printed if you hit Quip's API rate limit
 # but it will get them at the end
```

Run Html to Markdown Converter

```bash
 $ node_modules/html-md/bin/htmlmd -o quip-md/ quip/*
```

Freedom!
