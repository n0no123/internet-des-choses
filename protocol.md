Record send:

```json
{
  "id": "123",
  "data": {
    "temperature": 25,
    "humidity": 50
  }
}
```

Packets should always be encrypted (using a xor cipher with a shared secret) end encoded in json
