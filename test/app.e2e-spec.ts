import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { authRegisterDTO } from '../src/testing/auth-register-dto.mock'
import { Role } from '../src/enums/role.enum'
import dataSource from '../typeorm/data-source'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let userId: number

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
  })

  it('Add new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(authRegisterDTO)

    expect(response.statusCode).toBe(201)
    expect(typeof response.body.accessToken).toBe('string')
    accessToken = response.body.accessToken
  })

  it.skip('Login with the new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: authRegisterDTO.email,
        passwrod: authRegisterDTO.password
      })

    expect(response.statusCode).toBe(200)
    expect(typeof response.body.accessToken).toBe('string')

    accessToken = response.body.accessToken
  })

  it('Get logged user data', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(201)
    expect(typeof response.body.user.id).toBe('number')
    expect(response.body.user.role).toBe(Role.User)
  })

  it('Add new admin user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...authRegisterDTO,
        role: Role.Admin,
        email: 'another_email@mail.com'
      })

    expect(response.statusCode).toBe(201)
    expect(typeof response.body.accessToken).toBe('string')
    accessToken = response.body.accessToken
  })

  it('Validate user role', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(201)
    expect(typeof response.body.user.id).toBe('number')
    expect(response.body.user.role).toBe(Role.User)

    userId = response.body.user.id
  })

  it('Try to access an admin route', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(403)
  })

  it('Modify user role', async () => {
    const ds = await dataSource.initialize()

    const queryRunner = ds.createQueryRunner()

    await queryRunner.query(`
      UPDATE users SET role = ${Role.Admin} WHERE id = ${userId}
    `)

    const rows = await queryRunner.query(`
      SELECT * FROM users WHERE id = ${userId}
    `)

    dataSource.destroy()

    expect(rows.length).toEqual(1)
    expect(rows[0].role).toEqual(Role.Admin)
  })

  it('Try to access an admin route', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(2)
  })
})
