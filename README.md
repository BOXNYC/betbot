# BetBot *Takehome*

## Notes

### Assumptions made

*I wasn't sure about the proper use of the PlayerCard or payload properties, here's my rationele.*

- `bet_side` is the guessed score integer, negative means UNDER, positive means OVER
- `entry_fee` is the waged bet. I'm not confident this is correct.

### Security considerations

*This is a demo application and contains several security issues that would need to be addressed in a production environment:*

- No true authentication or authorization is implemented
- API endpoints are not rate-limited
- Input validation is minimal
- Error messages may expose sensitive information
- Public repo (temporarily)

### Possible enhancements

- Animated transitions-in
- Auth handled server-side with cookies, not client-site localStorage
- Rendered the final `code` as HTML as default with a tab to see the code.

### Thanks for the opportunity
