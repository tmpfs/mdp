## Library

Whilst designed to be used as a command line interface, in order to support ordered lists when round tripping the [marked][marked] tokens back to markdown it was necessary to extend the `Parser` and `Renderer` classes.

These are exposed via the `MarkdownParser` and `MarkdownRenderer` properties of the module.
