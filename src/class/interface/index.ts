export interface ClassInterface {
    university: string,
    name: string,
    faculty: [string],
    students: [string]
}

export interface NotesInterface {
    user: string,
    subject: string,
    class: string,
    file: string
}

export interface AssignmentInterface {
    user: string,
    subject: string,
    file: string,
    title: string,
    description: string,
    submission: string,
}

export interface SubjectInterface {
    name: string,
    faculty: [string],
    class: string,
    _id?: string
}