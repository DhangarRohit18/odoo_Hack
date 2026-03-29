const fs = require('fs');
const schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Company {
  id    String @id @default(uuid())
  name  String
}
`;
fs.writeFileSync('prisma/schema.prisma', schema.replace(/\r\n/g, '\n'), 'utf8');
