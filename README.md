# Lipsum

Canonical example for the [command][command] module.

```
Lorem ipsum is a program used to test help output.

If it looks like latin then it does nothing, other more meaningful options that
have an affect are interspersed, try --align and --format in particular. The
examples are valid, they illustrate some of the program functionality.

Usage: lipsum [-jcve] [--json] [--collapse] [--vanilla]
              [--sort=null|false|true|1|-1]
              [--format=text|json|markdown]
              [--align=column|line|flex|wrap] [--maximum=INT]

Options:

Command should be one of: lorem, mauris, in, ut, phasellus.

Commands:
 lorem              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 mauris             Mauris pulvinar aliquam adipiscing.
 in                 In vitae faucibus libero.
 ut                 Ut bibendum massa orci, a vestibulum est fermentum quis.
 phasellus          Phasellus facilisis eros vel dui lobortis, at posuere neque
                    placerat.

Arguments:
 -a, --align=[value]
                    Alignment style (column|line|flex|wrap).
     --color        Control terminal color.
 -j, --json         Print help as json.
 -c, --collapse     Collapse whitespace between sections.
 -v, --vanilla      Disable parameter replacement.
 -e, --exit         Include exit section from error definitions.
 -s, --sort=[value] Alters the help option sort order. Set to null to use
                    natural order which is likely the order that options were
                    declared in however this is not guaranteed. Use false for
                    the default sorting logic which favours options with more
                    names, use true to sort lexicographically
                    (Array.prototype.sort). Use 1 to sort by option string
                    length (determined by the length of the help option string),
                    reverse the order with -1.
 -f, --format=[value]
                    Set the help output format.
     --debug        Enable debugging.
 -m, --maximum=[value]
                    Maximum column width, default 80.
 -L, --lorem-ipsum-dolor=[VALUE]
                    Lorem ipsum dolor.
 -i, --ipsum=[VALUE]
                    Ipsum dolor sit amet.
 --mauris-pulvinar, --ut-bibendum=[VALUE]
                    Mauris pulvinar.
 -a, --aliquam=[VALUE]
                    In vitae faucibus libero. Nullam eget leo eget tortor tempor
                    luctus. Nam at ante felis. Fusce pellentesque aliquet nisl,
                    at tempus ante imperdiet elementum. Etiam a bibendum justo,
                    ut placerat massa. Mauris mattis tellus ligula, at luctus
                    ante iaculis quis. Cum sociis natoque penatibus et magnis
                    dis parturient montes, nascetur ridiculus mus. Cras eget dui
                    nisl.
     --help         Display this help and exit.
     --version      Output version information and exit.

Examples:
 lipsum -j          Print help as JSON.
 lipsum -f=markdown Print help as markdown.
 lipsum --align flex
                    Switch to flex alignment.
 lipsum --maximum=100
                    Increase maximum column width.
 lipsum --sort null Disable help option sort (natural order).
 lipsum --sort false
                    Use default sort order.
 lipsum --sort true Use lexicographic sort order.
 lipsum --sort 1    Sort by length of option (longest first).
 lipsum --sort -1   Sort by length of option (shortest first).
 lipsum --no-color  Disable ansi colors.

Report bugs to muji <noop@xpm.io>.
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](/LICENSE) if you feel inclined.

[command]: https://github.com/freeformsystems/cli-command
