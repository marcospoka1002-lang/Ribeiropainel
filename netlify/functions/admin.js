const SUPABASE_URL = 'https://aybmdptfcfqeyfoewlku.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

exports.handler = async function (event) {
  try {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada');
    }

    const token = (event.headers.authorization || '').replace('Bearer ', '');

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Não autorizado' })
      };
    }

    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${token}`
      }
    });

    const user = await userResponse.json();

    if (!userResponse.ok || !user.id) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Sessão inválida' })
      };
    }

    const profileResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=*`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    const profiles = await profileResponse.json();
    const profile = profiles?.[0];

    if (!profile || profile.role !== 'admin') {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Acesso de administrador negado' })
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const action = body.action;

    if (action === 'list') {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?select=*&order=created_at.desc`,
        {
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
          }
        }
      );

      const clients = await response.json();

      if (!response.ok) {
        throw new Error(clients.message || 'Erro ao carregar clientes');
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ clients })
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Operação inválida' })
    };

  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Erro na operação' })
    };
  }
};
