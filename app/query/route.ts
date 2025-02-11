import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listInvoices() {
  const data = await sql`
    SELECT DISTINCT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;
  return data;
}

export async function GET() {
  try {
    const data = await listInvoices();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) { // 'error' tipini 'unknown' olarak belirtiyoruz
    if (error instanceof Error) { // Error instance'ı olduğundan emin olalım
      return new Response(
        JSON.stringify({ error: error.message }), // 'error.message' kullanabiliriz
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      // Eğer hata bir Error instance'ı değilse, genel bir hata mesajı dönebiliriz
      return new Response(
        JSON.stringify({ error: 'Bir bilinmeyen hata oluştu' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }
}
