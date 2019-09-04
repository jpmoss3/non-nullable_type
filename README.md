## Abstract
This is a minimal project that exposes where trying to query object in prisma leads to the error:
**"Cannot return null for non-nullable type"**

## steps to reproduce:
1. Clone the repository
```bash
git clone https://github.com/jpmoss3/non-nullable_type.git
cd non-nullable_type/
npm install
```
2. Set up Prisma
```bash
npm run prisma:up
```
3. Deploy schema
```bash
npm run prisma:deploy
```
3. Get Prisma token and copy in 'token' constant of index.js
```bash
npm run prisma:token
```
4. Run test
```bash
npm run test
```

### result
As soon as enough **Bar** object are created in the initial loop (10 in my setup),
just trying to get all **Bars** while they are deleted will raise the error:
***"Cannot return null for non-nullable type"***

It seems that the deletion of **Bar** object are ***not*** transactional as you can find **Bar** object with null **Foo** (although mandatory in graphQL schema)