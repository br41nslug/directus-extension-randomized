# Directus Extension Randomized Results
As the name suggests this extension will enable Randomized results mirroring the Directus `/items/:collection` endpoint.

> Tested with Directus 9.22.1

## Installation

The package is published to npm:
`npm install directus-extension-randomized-endpoint`

**Manual Installation**
- Download or fork the repository
- Install the requirements\
  `npm install`
- Build the extension\
  `npm run build`
- Move the result to your extension folder\
  `mv dist extensions/endpoints/directus-extension-randomized`
- Restart your Directus instance

## Usages

Mirrors the REST version of this core endpoint supporting the same parameters https://docs.directus.io/reference/items.html#get-items

**GET /randomized/test_collection**
```json
[
   { "id": 6, "status": "draft", "value": "369" },
   { "id": 2, "status": "published", "value": "456" },
   { "id": 4, "status": "published", "value": "147" },
   { "id": 3, "status": "published", "value": "789" },
   { "id": 5, "status": "draft", "value": "258" },
   { "id": 1, "status": "published", "value": "123" }
]
```
```json
[
    {"id": 3, "status": "published", "value": "789"},
    {"id": 4, "status": "published", "value": "147"},
    {"id": 1, "status": "published", "value": "123"},
    {"id": 2, "status": "published", "value": "456"},
    {"id": 5, "status": "draft", "value": "258"},
    {"id": 6, "status": "draft", "value": "369"}
]
```
**GET /randomized/test_collection?limit=2**
```json
[
    {"id": 4, "status": "published", "value": "147"},
    {"id": 5, "status": "draft", "value": "258"}
]
```
```json
[
    {"id": 2, "status": "published", "value": "456"},
    {"id": 4, "status": "published", "value": "147"}
]
```
**GET /randomized/test_collection?limit=2&filter[status][_eq]=published&fields=value,status**
```json
[
    {"value": "456", "status": "published"},
    {"value": "147", "status": "published"}
]
```
```json
[
    {"value": "789", "status": "published"},
    {"value": "147", "status": "published"}
]
```
