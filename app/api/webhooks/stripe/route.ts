// Online payments are not enabled for this site.
export async function POST() {
  return Response.json(
    { error: 'Los pagos en línea no están disponibles.', code: 'PAYMENTS_DISABLED' },
    { status: 410 },
  )
}