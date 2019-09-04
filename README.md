## Abstract
This is a minimal project that exposes a situation where trying to query object in prisma leads to the error:

**"Cannot return null for non-nullable type"**

The data model contains 2 types **Foo** and **Bar** where **Bar** has a mandatory relation to **Foo**.
After nested creation of multiple **Bar** with **Foo**, the test deletes all **Bar** objects
and in the mean time retrieve the remaining **Bar** objects.

It happen that it is possible to reach an invalid **Bar** object:
- it seems that the deletion of **Bar** object are ***not*** transactional as you can find **Bar** object with null **Foo** (although mandatory in graphQL schema)

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
