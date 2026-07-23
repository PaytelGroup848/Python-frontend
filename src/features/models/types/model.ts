export interface Model {

    id: number;

    code: string;

    display_name: string;

    provider_id: number;

    description: string | null;

}

export interface ModelListResponse {

    items: Model[];

}