## Environment

You may enable environment variable replacement by setting the `env` configuration property to `true`. If you wish to disable environment variable replacement for a partial set `env` to `false` for the partial.

Environment variables are replaced using the forms:

```
$variable
${variable}
```

If the referenced variable is not set then the variable reference is not replaced and will be visible in the result.

You may disable environment variable replacement by preceeding the dollar with a single backslash:

```
\$variable
\${variable}
```

When replacement is performed the backslash will be removed, resulting in literal variable references:

```
$variable
${variable}
```
