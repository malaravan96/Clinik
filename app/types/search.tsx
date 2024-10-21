// types.ts

  
type SortParam = {
    priority: number;
    orderBy: number;
    sortBy: string;
  };
  
  export type SearchRequestBody = {
    pageNumber: number;
    pageSize: number;
    filter: any;
    sortParams: SortParam[];
  };
  

  