export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[];

export interface Database {
    public: {
        Tables: {
            lesson_summaries_meta: {
                Row: {
                    created: string;
                    created_at: string;
                    filename: string;
                    id: number;
                    title: string;
                    updated: string;
                };
                Insert: {
                    created: string;
                    created_at?: string;
                    filename: string;
                    id?: number;
                    title: string;
                    updated: string;
                };
                Update: {
                    created?: string;
                    created_at?: string;
                    filename?: string;
                    id?: number;
                    title?: string;
                    updated?: string;
                };
            };
            notes: {
                Row: {
                    created: string;
                    filename: string;
                    id: number;
                    line: string;
                    title: string;
                    updated: string;
                };
                Insert: {
                    created: string;
                    filename: string;
                    id?: number;
                    line: string;
                    title: string;
                    updated: string;
                };
                Update: {
                    created?: string;
                    filename?: string;
                    id?: number;
                    line?: string;
                    title?: string;
                    updated?: string;
                };
            };
            posts: {
                Row: {
                    created_at: string;
                    id: string;
                    name: string;
                    post: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    name: string;
                    post: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    name?: string;
                    post?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            get_notes_meta: {
                Args: Record<PropertyKey, never>;
                Returns: {
                    title: string;
                    updated: string;
                    filename: string;
                    created: string;
                }[];
            };
            search_notes: {
                Args: {
                    q: string;
                };
                Returns: {
                    title: string;
                    line: string;
                }[];
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
