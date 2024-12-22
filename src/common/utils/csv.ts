import { parse } from "json2csv";
import { Readable } from "stream";

export const sendCsv = (
  res: any,
  isExcel: boolean,
  data: any,
  fields: string[],
) => {
  if (!isExcel) return res.send(data);
  const csv = parse(data, { fields });
  return res.type("text/csv").send(
    new Readable({
      read() {
        this.push(csv);
        this.push(null);
      },
    }),
  );
};
