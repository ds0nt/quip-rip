# quip-rip

Downloads all of one's Quip folders and documents.

...because some of us have 366 of them.

## Usage

Install [io.js](https://iojs.org/en/index.html)

Clone this repository.

Generate a [Quip Personal Token](https://quip.com/api/personal-token) and add it in keys.json

Download!

```bash
 $ node quip.js     # go make a coffee
 
 # Quip: SLOWWW DOWNNNNNN 
 # ^ may result in error message, but we just retry
```

Convert to Markdown

```bash
 $ node_modules/html-md/bin/htmlmd -o quip-md/ quip/*
```

**Freedom!**
