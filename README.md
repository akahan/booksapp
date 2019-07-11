```
curl -X POST http://127.0.0.1:7777/books -d '{"filter": { "id": 1 }}' -H "Content-Type: application/json"
curl -X POST http://127.0.0.1:7777/book -d '{"authorId": 3, "title": "sddfdfsdsdfefefwf"}' -H "Content-Type: application/json"
curl -X PUT http://127.0.0.1:7777/book/2 -d '{"authorId": 2, "title": "fuasnaskd"}' -H "Content-Type: application/json"
curl -X POST http://127.0.0.1:7777/book/1 -d '{"authorId": 1, "title": "sddfdfsdsdfefefwf"}' -H "Content-Type: application/json"

```
