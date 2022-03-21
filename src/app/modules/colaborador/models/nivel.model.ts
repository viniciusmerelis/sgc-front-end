import { SelectItem } from "primeng";

export class Nivel {
    static CONHECE = 'CONHECE';
    static SABE_APLICAR = 'SABE_APLICAR';
    static SABE_ENSINAR = 'SABE_ENSINAR';

    static selectItem: SelectItem[] = [
        {
            value: Nivel.CONHECE,
            label: 'Conhece'
        },
        {
            value: Nivel.SABE_APLICAR,
            label: 'Sabe Aplicar'
        },
        {
            value: Nivel.SABE_ENSINAR,
            label: 'Sabe Ensinar'
        }
    ]
}