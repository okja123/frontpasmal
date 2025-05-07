export interface ITreeStructure { 
 Type?:string,  
    Guid: string,
    SiteName: string,
    Name: string,
    Description: string,
    CompleteTree: string,
    CompleteTreeGuid:string[],
    ParentGuid: string,
    Children: ITreeStructure[]
 }