export interface MagicLinkEmailTemplateOptions {
	link: string;
}

export class MagicLinkEmailTemplate {
	constructor(private readonly options: MagicLinkEmailTemplateOptions) {}

	get subject(): string {
		return 'Ingresa a tu cuenta de Quiz | DMDDA';
	}

	render(): string {
		const { link } = this.options;

		return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${this.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:8px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-size:24px;font-weight:600;color:#18181b;">Quiz | DMDDA</p>
              <p style="margin:0 0 32px;font-size:15px;color:#71717a;">Haz click en el botón de abajo. Este botón solo se puede utilizar una vez.</p>
              <a href="${link}" style="display:inline-block;padding:12px 24px;background-color:#18181b;color:#ffffff;text-decoration:none;border-radius:6px;font-size:15px;font-weight:500;">Ingresar</a>
              <p style="margin:32px 0 0;font-size:13px;color:#a1a1aa;">Si tú no pediste este email, puedes ignorar el mismo sin problemas.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
	}
}
