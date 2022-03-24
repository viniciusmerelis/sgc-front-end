import { SelectItem } from "primeng";

export class Nivel {
    static CONHECE = 'CONHECE';
    static SABE_APLICAR = 'SABE_APLICAR';
    static SABE_ENSINAR = 'SABE_ENSINAR';
}

export class NivelUtil {

    static selectItems: SelectItem[] = [
        { value: Nivel.CONHECE, label: 'Conhece' },
        { value: Nivel.SABE_APLICAR, label: 'Sabe Aplicar' },
        { value: Nivel.SABE_ENSINAR, label: 'Sabe Ensinar' }
    ];

    static getLabel(nivel: Nivel): string {
        const item = NivelUtil.selectItems.find(item => item.value == nivel)
        if (item) {
            return item.label
        }
        return '' + nivel;
    }
}
