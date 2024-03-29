import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {parseCookies, destroyCookie} from 'nookies'
import { AuthTokenError } from '../errors/AythTokenError';

export function withSSRAuth<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)

    if (!cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      }
    }

    try {
      return await fn(ctx)

    } catch (error) {

      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, 'nextauth.token')
        destroyCookie(ctx, 'nextauth.refreshToken')
  
        return {
          redirect: {
           destination: '/',
            permanent: false
          }
        }
      }

    }

  }
}