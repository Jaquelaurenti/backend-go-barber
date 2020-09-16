declare namespace Express {
  // sobrescrevendo a importação do Request sem substuir, apenas anexando
  export interface Request {
    user:{
      id: string
    },
  }
}
