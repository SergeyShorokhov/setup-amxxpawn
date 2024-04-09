# Setup AMXXPawn Action

![](https://github.com/wopox1337/setup-amxxpawn/workflows/Main%20Workflow/badge.svg)

This action sets-up, cache and adds amxmodx scripting directory to the path

# Usage

See [action.yml](https://github.com/wopox1337/setup-amxxpawn/blob/master/action.yml)

## Basic:

```yaml
steps:
- uses: actions/checkout@v4

- uses: wopox1337/setup-amxxpawn@master
  with:
    version: '1.9.x'

- run: amxxpc -iAnotherIncludeDirectory plugin.sma -o output/plugin.amxx
```

## Matrix:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        sm-version: [ '1.9.x', '1.10.x', '1.10.5466', '>= 1.10.5466']

    name: AMXModX version ${{ matrix.sm-version }}
    steps:
      - uses: actions/checkout@v4

      - name: Setup AMXPawn
        uses: wopox1337/setup-amxxpawn@master
        with:
          version: ${{ matrix.sm-version }}

      - run: amxxpc -iAnotherIncludeDirectory plugin.sma -o output/plugin.amxx
```

## Extract the version of the .sma file:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest

    name: AMXModX version ${{ matrix.sm-version }}
    steps:
      - uses: actions/checkout@v4

      - name: Setup AMXXPawn
        id: setup_amxxpawn
        uses: wopox1337/setup-amxxpawn@master
        with:
          version: '1.10.x'
          version-file: ./plugin.sma

      - run: |
          amxxpc -iAnotherIncludeDirectory plugin.sma -o output/plugin.amxx
          echo Plugin version ${{ steps.setup_amxxpawn.outputs.plugin-version }}
```