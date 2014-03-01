$0
==

## Options

* `-f, --force`: Force file overwrite.
* `--pandoc`: Include pandoc meta data.
* `--inspect`: Enable inspect middleware.
* `--section [1-8]`: Set the man page section.
* `-n, --filename [name]`: Set the output file name.
* `--[no]-pedantic`: Enable or disable pedantic middleware.
* `--[no]-toc`: Enable or disable the table of contents middleware, this overrides a `toc` value in the meta data.
* `--toc-title [title]`: Set the title for the table of contents, this overrides the `--[no]-toc` flag and the `toc` meta data property.
* `-p, --print [format]`: Print document to stdout
* `--timeout [ms]`: Millisecond timeout for middleware.
* `-t, --title [title]`: Document title.
* `-i, --input [file ...]`: Meta definition file(s).
* `-o, --output [file ...]`: Output file(s), may be specified once for each format. The output format is determined by the file extension, md, txt, html, xhtml or [1-8]. If no output files are specified then README.md is generated in the current directory.

If the output path is a directory then a file is created for each supported format.
* `-v, --verbose`: Print more information.
* `-w, --middleware [file ...]`: Require custom middleware.

## Examples

Generate `README.md` from `package.json`, overwriting the file if it already exists:

```
$0 ${opt_force_long}
```

Include a table of contents:

```
$0 ${opt_toc_yes}
```

Disable table of contents (overrides meta data):

```
$0 ${opt_toc_no}
```

Enables the toc middleware and sets the title for the table of contents:

```
$0 ${opt_toc_title_long} Navigation
```

Generate `README.md` with pandoc meta data prepended:

```
$0 ${opt_force_long} ${opt_pandoc_long}
```
