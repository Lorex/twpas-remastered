import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export interface ICustomWorld extends World {
  // Browser
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  // Test state
  currentUser?: {
    id: string;
    username: string;
    role: string;
  };

  // API
  apiBaseUrl: string;
  authToken?: string;
  lastApiResponse?: any;

  // Current test data
  currentPatient?: any;
  currentClaim?: any;
  currentFhirBundle?: any;

  // Helper methods
  login(username: string, password: string): Promise<void>;
  logout(): Promise<void>;
  apiGet(path: string): Promise<any>;
  apiPost(path: string, data: any): Promise<any>;
  apiPut(path: string, data: any): Promise<any>;
  apiDelete(path: string): Promise<any>;
}

class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  currentUser?: { id: string; username: string; role: string };
  apiBaseUrl: string;
  authToken?: string;
  lastApiResponse?: any;
  currentPatient?: any;
  currentClaim?: any;
  currentFhirBundle?: any;

  constructor(options: IWorldOptions) {
    super(options);
    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001/api/v1';
  }

  async login(username: string, password: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.authToken = data.token;
    this.currentUser = {
      id: data.user.id,
      username: data.user.username,
      role: data.user.role,
    };
  }

  async logout(): Promise<void> {
    if (this.authToken) {
      await fetch(`${this.apiBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    }
    this.authToken = undefined;
    this.currentUser = undefined;
  }

  async apiGet(path: string): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
      },
    });

    this.lastApiResponse = {
      status: response.status,
      data: await response.json(),
    };

    return this.lastApiResponse;
  }

  async apiPost(path: string, data: any): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    this.lastApiResponse = {
      status: response.status,
      data: await response.json(),
    };

    return this.lastApiResponse;
  }

  async apiPut(path: string, data: any): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    this.lastApiResponse = {
      status: response.status,
      data: await response.json(),
    };

    return this.lastApiResponse;
  }

  async apiDelete(path: string): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}${path}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });

    this.lastApiResponse = {
      status: response.status,
      data: response.status !== 204 ? await response.json() : null,
    };

    return this.lastApiResponse;
  }
}

setWorldConstructor(CustomWorld);
