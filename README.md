# URLShortener

dcard web backend intern hw
check web on [https://dcard-url-shortener.herokuapp.com/](https://dcard-url-shortener.herokuapp.com/)
way to use:

- add longurl
  > method:post
  > {
      "longUrl" : "[ original url]",
      "expired_date":""
  }
  - return: short url id
- front shoort to longurl
  > method: get
  > url: https://dcard-url-shortener.herokuapp.com/[shortid]
