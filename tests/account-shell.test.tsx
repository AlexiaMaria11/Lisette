import { act, fireEvent, renderRouter, screen, waitFor } from "expo-router/testing-library";

import { createFakeSupabase, type FakeSupabase } from "./helpers/fake-supabase";

// Device storage survives an app restart, so it lives outside each render.
const mockDeviceStorage = new Map<string, string>();
let mockSupabase: FakeSupabase;

jest.mock("@/lib/storage", () => ({
  getItem: async (key: string) => mockDeviceStorage.get(key) ?? null,
  setItem: async (key: string, value: string) => void mockDeviceStorage.set(key, value),
  removeItem: async (key: string) => void mockDeviceStorage.delete(key),
}));
jest.mock("@/lib/supabase", () => ({
  get supabase() {
    return mockSupabase;
  },
}));

beforeEach(() => {
  mockDeviceStorage.clear();
  mockSupabase = createFakeSupabase();
});

function startApp(initialUrl = "/") {
  return renderRouter("./src/app", { initialUrl });
}

describe("language_persists_and_private_routes_redirect", () => {
  test("first launch offers both languages with no preselected default", async () => {
    startApp();

    expect(await screen.findByRole("button", { name: "Română" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "English" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Creează contul" })).toBeNull();
  });

  test("Romanian choice survives a restart", async () => {
    const first = startApp();
    fireEvent.press(await screen.findByRole("button", { name: "Română" }));
    expect(await screen.findByRole("button", { name: "Creează contul" })).toBeOnTheScreen();
    expect(screen.getByText("Unde editurile își găsesc autorii, iar cărțile, cititorii.")).toBeOnTheScreen();
    first.unmount();

    startApp();

    expect(await screen.findByRole("button", { name: "Creează contul" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "English" })).toBeNull();
  });

  test("English choice shows the approved English tagline", async () => {
    startApp();
    fireEvent.press(await screen.findByRole("button", { name: "English" }));

    expect(await screen.findByRole("button", { name: "Create account" })).toBeOnTheScreen();
    expect(screen.getByText("Writers find their way. Readers find their writers.")).toBeOnTheScreen();
  });

  test("signed-out /manuscripts redirects to the start screen", async () => {
    mockDeviceStorage.set("lisette.locale", "ro");
    const app = startApp("/manuscripts");

    expect(await screen.findByRole("button", { name: "Creează contul" })).toBeOnTheScreen();
    expect(app.getPathname()).toBe("/");
  });

  test("signing in loads the account's saved language", async () => {
    mockDeviceStorage.set("lisette.locale", "ro");
    mockSupabase.addVerifiedUser("reader@example.test", "correct-horse-1", "en");
    const app = startApp("/sign-in");

    fireEvent.changeText(await screen.findByLabelText("Email"), "reader@example.test");
    fireEvent.changeText(screen.getByLabelText("Parolă"), "correct-horse-1");
    fireEvent.press(screen.getByRole("button", { name: "Intră în cont" }));

    expect(await screen.findByText("Manuscripts")).toBeOnTheScreen();
    expect(app.getPathname()).toBe("/manuscripts");
  });

  test("wrong password shows an error and stays signed out", async () => {
    mockDeviceStorage.set("lisette.locale", "ro");
    mockSupabase.addVerifiedUser("reader@example.test", "correct-horse-1");
    const app = startApp("/sign-in");

    fireEvent.changeText(await screen.findByLabelText("Email"), "reader@example.test");
    fireEvent.changeText(screen.getByLabelText("Parolă"), "wrong-password");
    fireEvent.press(screen.getByRole("button", { name: "Intră în cont" }));

    expect(await screen.findByRole("alert")).toBeOnTheScreen();
    expect(app.getPathname()).toBe("/sign-in");
  });

  test("creating an account leads to the email check screen", async () => {
    mockDeviceStorage.set("lisette.locale", "ro");
    const app = startApp("/create-account");

    fireEvent.changeText(await screen.findByLabelText("Nume"), "Ioana Mareș");
    fireEvent.changeText(screen.getByLabelText("Email"), "ioana@example.test");
    fireEvent.changeText(screen.getByLabelText("Parolă"), "o-parola-lunga");
    fireEvent.press(screen.getByRole("button", { name: "Creează contul" }));

    expect(await screen.findByText(/ioana@example\.test/)).toBeOnTheScreen();
    expect(app.getPathname()).toBe("/verify-email");
    expect(mockSupabase.users.get("ioana@example.test")?.verified).toBe(false);
  });

  test("a password shorter than 10 characters is rejected before sending", async () => {
    mockDeviceStorage.set("lisette.locale", "ro");
    const app = startApp("/create-account");

    fireEvent.changeText(await screen.findByLabelText("Nume"), "Ioana");
    fireEvent.changeText(screen.getByLabelText("Email"), "ioana@example.test");
    fireEvent.changeText(screen.getByLabelText("Parolă"), "scurta");
    fireEvent.press(screen.getByRole("button", { name: "Creează contul" }));

    expect(await screen.findByRole("alert")).toBeOnTheScreen();
    expect(mockSupabase.users.has("ioana@example.test")).toBe(false);
    expect(app.getPathname()).toBe("/create-account");
  });

  test("changing language after sign-in is saved to the account", async () => {
    mockDeviceStorage.set("lisette.locale", "ro");
    const user = mockSupabase.addVerifiedUser("reader@example.test", "correct-horse-1", "ro");
    mockSupabase.signInAs(user.email);
    startApp("/settings");

    fireEvent.press(await screen.findByRole("button", { name: "English" }));

    await waitFor(() => expect(user.locale).toBe("en"));
    expect(await screen.findByText("Settings")).toBeOnTheScreen();
  });

  test("signing out returns to the start screen", async () => {
    mockDeviceStorage.set("lisette.locale", "ro");
    const user = mockSupabase.addVerifiedUser("reader@example.test", "correct-horse-1", "ro");
    mockSupabase.signInAs(user.email);
    const app = startApp("/settings");

    const signOut = await screen.findByRole("button", { name: "Ieși din cont" });
    await act(async () => {
      fireEvent.press(signOut);
    });

    expect(await screen.findByRole("button", { name: "Creează contul" })).toBeOnTheScreen();
    expect(app.getPathname()).toBe("/");
  });
});
