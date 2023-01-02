export interface ClassInterface {
    university: string,
    name: string,
    faculty: [string],
    students: [string]
}

export interface NotesInterface {
    user: string,
    class: string,
    file: string
}

export interface AssignmentInterface {
    user: string,
    class: string,
    file: string,
    title: string,
    description: string,
    submission: string,
}