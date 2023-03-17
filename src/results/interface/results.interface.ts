export interface ResultsInterface {
    _id?: string,
    name: string,
    classID: string,
    subjectID: string,
    file: string,
    user: string,
    university: string,
}

export interface StudentMarksInterface {
    _id?: string,
    result: string,
    user: string,
    marks: number,
    maxMarks: number,
}