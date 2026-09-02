import type { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

const { userController } = await import('./user-controller.js');

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

interface ResponseDouble {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
  send: ReturnType<typeof vi.fn>;
}

const createResponse = (): { response: Response; double: ResponseDouble } => {
  const double: ResponseDouble = {
    status: vi.fn(),
    json: vi.fn(),
    send: vi.fn(),
  };
  double.status.mockReturnValue(double);
  return { response: double as unknown as Response, double };
};

const createRequest = (body: unknown, params: unknown = {}): Request =>
  ({ body, params }) as Request;

describe('userController', () => {
  const createdProfileIds: string[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await Promise.all(
      createdProfileIds.splice(0).map(async (id) => {
        const request = createRequest(undefined, { id });
        const { response } = createResponse();
        await userController.deleteById(request, response);
      }),
    );
  });

  it('creates a profile with normalized input', async () => {
    // Arrange
    const request = createRequest({
      email: 'ada@example.com',
      displayName: '  Ada Lovelace  ',
    });
    const { response, double } = createResponse();

    // Act
    await userController.create(request, response);

    // Assert
    expect(double.status).toHaveBeenCalledWith(201);
    expect(double.json).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'ada@example.com',
        displayName: 'Ada Lovelace',
        id: expect.any(String),
        createdAt: expect.any(String),
      }),
    );
    trackCreatedProfile(double);
  });

  it('rejects a create request with an invalid email address', async () => {
    // Arrange
    const request = createRequest({ email: 'not-an-email', displayName: 'Ada' });
    const { response, double } = createResponse();

    // Act
    const action = userController.create(request, response);

    // Assert
    await expect(action).rejects.toThrow();
    expect(double.status).not.toHaveBeenCalled();
  });

  it('lists profiles created during the request lifecycle', async () => {
    // Arrange
    const createRequestForProfile = createRequest({
      email: 'ada@example.com',
      displayName: 'Ada',
    });
    const createResponseForProfile = createResponse();
    await userController.create(
      createRequestForProfile,
      createResponseForProfile.response,
    );
    trackCreatedProfile(createResponseForProfile.double);
    const listRequest = createRequest(undefined);
    const { response, double } = createResponse();

    // Act
    await userController.list(listRequest, response);

    // Assert
    expect(double.status).toHaveBeenCalledWith(200);
    expect(double.json).toHaveBeenCalledWith({
      users: [expect.objectContaining({ email: 'ada@example.com' })],
    });
  });

  it('returns a profile for an existing UUID', async () => {
    // Arrange
    const { profile } = await createProfile();
    const request = createRequest(undefined, { id: profile.id });
    const { response, double } = createResponse();

    // Act
    await userController.getById(request, response);

    // Assert
    expect(double.status).toHaveBeenCalledWith(200);
    expect(double.json).toHaveBeenCalledWith(profile);
  });

  it('returns 404 when a requested profile does not exist', async () => {
    // Arrange
    const request = createRequest(undefined, { id: crypto.randomUUID() });
    const { response, double } = createResponse();

    // Act
    await userController.getById(request, response);

    // Assert
    expect(double.status).toHaveBeenCalledWith(404);
    expect(double.json).toHaveBeenCalledWith({
      error: { code: 'USER_NOT_FOUND', message: 'No user with that id' },
    });
  });

  it('rejects a lookup request with a malformed UUID', async () => {
    // Arrange
    const request = createRequest(undefined, { id: 'invalid-id' });
    const { response, double } = createResponse();

    // Act
    const action = userController.getById(request, response);

    // Assert
    await expect(action).rejects.toThrow();
    expect(double.status).not.toHaveBeenCalled();
  });

  it('updates editable fields while preserving the profile creation time', async () => {
    // Arrange
    const { profile } = await createProfile();
    const request = createRequest({
      id: profile.id,
      email: 'grace@example.com',
      displayName: 'Grace Hopper',
    });
    const { response, double } = createResponse();

    // Act
    await userController.update(request, response);

    // Assert
    expect(double.status).toHaveBeenCalledWith(200);
    expect(double.json).toHaveBeenCalledWith({
      ...profile,
      email: 'grace@example.com',
      displayName: 'Grace Hopper',
    });
  });

  it('returns 404 when updating a profile that does not exist', async () => {
    // Arrange
    const request = createRequest({
      id: crypto.randomUUID(),
      email: 'ada@example.com',
      displayName: 'Ada',
    });
    const { response, double } = createResponse();

    // Act
    await userController.update(request, response);

    // Assert
    expect(double.status).toHaveBeenCalledWith(404);
    expect(double.json).toHaveBeenCalledWith({
      error: { code: 'USER_NOT_FOUND', message: 'No user with that id' },
    });
  });

  it('deletes an existing profile without returning a response body', async () => {
    // Arrange
    const { profile } = await createProfile();
    const request = createRequest(undefined, { id: profile.id });
    const { response, double } = createResponse();

    // Act
    await userController.deleteById(request, response);

    // Assert
    expect(double.status).toHaveBeenCalledWith(204);
    expect(double.send).toHaveBeenCalledWith();
  });

  it('returns 404 when deleting a profile that does not exist', async () => {
    // Arrange
    const request = createRequest(undefined, { id: crypto.randomUUID() });
    const { response, double } = createResponse();

    // Act
    await userController.deleteById(request, response);

    // Assert
    expect(double.status).toHaveBeenCalledWith(404);
    expect(double.json).toHaveBeenCalledWith({
      error: { code: 'USER_NOT_FOUND', message: 'No user with that id' },
    });
  });

  async function createProfile(): Promise<{ profile: UserProfile }> {
    const request = createRequest({ email: 'ada@example.com', displayName: 'Ada' });
    const { response, double } = createResponse();
    await userController.create(request, response);
    const profile = trackCreatedProfile(double);

    return { profile };
  }

  function trackCreatedProfile(double: ResponseDouble): UserProfile {
    const profile = double.json.mock.calls[0]?.[0] as UserProfile | undefined;

    if (!profile) {
      throw new Error('Expected profile creation to return a profile');
    }

    createdProfileIds.push(profile.id);
    return profile;
  }
});