import { SelectItem } from 'primeng';

export class Utils {

    public static converterParaDropDown(lista: any[], campoLabel, campoValue?): SelectItem[] {
        if (!campoValue) {
            campoValue = campoLabel;
        }

        return lista.map((item) => {
            return { label: item[campoLabel], value: item[campoValue] };
        });
    }
}
