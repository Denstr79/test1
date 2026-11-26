# Build tools
`python3 -I tools/build.py` regenerates all HTML pages (except the hand-written `index.html` body, whose header/footer/links are re-synced) from the content extracted into the reference directory (`REF` env var). Page registry, navigation and URL map live in `sitedata.py`; image URL→file map in `imgmap.json`.
