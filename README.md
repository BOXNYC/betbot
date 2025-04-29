# BetBot *Takehome*

## Notes

- Framework: Next.js
- Backend: Serverless Lambda functions
- Frontend: React
- Services: OpenAI, Vercel
- DX: Lint, Typescript, TailwindCSS
- AI: Prompting-only, VERY slow ;/

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
- Data for AI should be vector embedded, not passed through prompts

### Possible enhancements

- Use vector embeddings, custom LLM modeling, etc. to optimize and speed up AI and lower token costs as passing data through the prompt is expensive
- Animated transitions-in
- Auth handled server-side with cookies, not client-site localStorage
- Rendered the final `code` as HTML as default with a tab to see the code.
- More code commenting
- Separate API: Nest.js, FastAPI, Flask, etc.

### Thanks for the opportunity
