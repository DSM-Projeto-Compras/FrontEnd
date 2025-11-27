import { render, screen, fireEvent, act } from "@testing-library/react";
import '@testing-library/jest-dom'
import ChangePasswordPage from "../../../app/pages/change-password/page";
import AuthService from "../../../app/services/authService";

jest.mock("../../../app/services/authService");

describe.skip("Change Password Page Elements", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("should send email code and display elements", async () => {
    (AuthService.forgotPassword as jest.Mock).mockResolvedValue({
      message: "Código enviado com sucesso!",
    });

    render(<ChangePasswordPage />);

    const inputEmail = screen.getByPlaceholderText("Digite seu email");
    const btnEnviar = screen.getByRole("button", { name: /enviar código/i });

    fireEvent.change(inputEmail, { target: { value: "teste@email.com" } });
    
    expect(inputEmail).toBeInTheDocument()
    expect(btnEnviar).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(btnEnviar);
    });

    const inputCodigo = screen.getByPlaceholderText(/código recebido/i)
    const inputSenha = screen.getByPlaceholderText(/nova senha/i)
    const successMessage = screen.getByText("Código enviado com sucesso!")

    
    expect(inputCodigo).toBeInTheDocument()
    expect(inputSenha).toBeInTheDocument()
    expect(successMessage).toBeInTheDocument()
  })

  it("should change user password", async () => {
    (AuthService.forgotPassword as jest.Mock).mockResolvedValue({
      message: "Código enviado com sucesso!",
    });

    (AuthService.resetPassword as jest.Mock).mockResolvedValue({
      message: "Senha alterada!",
    });

    render(<ChangePasswordPage />);

    const inputEmail = screen.getByPlaceholderText("Digite seu email");
    const btnEnviar = screen.getByRole("button", { name: /enviar código/i });

    fireEvent.change(inputEmail, { target: { value: "teste@email.com" } });
    
    await act(async () => {
      fireEvent.click(btnEnviar);
    });

    expect(AuthService.forgotPassword).toHaveBeenCalledWith("teste@email.com");

    const inputCodigo = await screen.findByPlaceholderText("Código recebido");
    const inputNovaSenha = screen.getByPlaceholderText("Nova senha");
    const btnRedefinir = screen.getByRole("button", { name: /redefinir senha/i });

    fireEvent.change(inputCodigo, { target: { value: "123456" } });
    fireEvent.change(inputNovaSenha, { target: { value: "Senhateste@123" } });

    await act(async () => {
      fireEvent.click(btnRedefinir);
    });

    expect(AuthService.resetPassword).toHaveBeenCalledWith(
      "teste@email.com",
      "123456",
      "Senhateste@123"
    );

    expect(await screen.findByText(/senha alterada com sucesso/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /volte para o login/i })
    ).toBeInTheDocument();
  });

  //#region erro API (error.response.data.message)

  it("should show API error message when forgotPassword fails", async () => {
    (AuthService.forgotPassword as jest.Mock).mockRejectedValue({
      response: { data: { message: "Email não encontrado" } }
    });

    render(<ChangePasswordPage />);

    const inputEmail = screen.getByPlaceholderText("Digite seu email");
    const btnEnviar = screen.getByRole("button", { name: /enviar código/i });

    fireEvent.change(inputEmail, { target: { value: "email@falha.com" } });

    await act(async () => {
      fireEvent.click(btnEnviar);
    });

    expect(await screen.findByText("Email não encontrado")).toBeInTheDocument();
  });


  it("should set empty error message when forgotPassword fails without message", async () => {
    (AuthService.forgotPassword as jest.Mock).mockRejectedValue({
      response: { data: {} }
    });

    render(<ChangePasswordPage />);

    const inputEmail = screen.getByPlaceholderText("Digite seu email");
    const btnEnviar = screen.getByRole("button", { name: /enviar código/i });

    fireEvent.change(inputEmail, { target: { value: "email@falha.com" } });

    await act(async () => {
      fireEvent.click(btnEnviar);
    });

    expect(screen.queryByText(/código enviado com sucesso/i)).not.toBeInTheDocument();

    expect(screen.getByPlaceholderText("Digite seu email")).toBeInTheDocument();
  });


  it("should show API error message when resetPassword fails", async () => {
    (AuthService.forgotPassword as jest.Mock).mockResolvedValue({
      message: "Código enviado com sucesso!"
    });

    (AuthService.resetPassword as jest.Mock).mockRejectedValue({
      response: { data: { message: "Código inválido" } }
    });

    render(<ChangePasswordPage />);

    fireEvent.change(screen.getByPlaceholderText("Digite seu email"), {
      target: { value: "teste@email.com" },
    });
    await act(async () => fireEvent.click(screen.getByRole("button", { name: /enviar código/i })));

    fireEvent.change(screen.getByPlaceholderText("Código recebido"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nova senha"), {
      target: { value: "Senha@123" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /redefinir senha/i }));
    });

    expect(await screen.findByText("Código inválido")).toBeInTheDocument();
  });


  it("should show fallback reset error when API returns no message", async () => {
    (AuthService.forgotPassword as jest.Mock).mockResolvedValue({
      message: "Código enviado com sucesso!"
    });

    (AuthService.resetPassword as jest.Mock).mockRejectedValue({
      response: { data: {} }
    });

    render(<ChangePasswordPage />);

    fireEvent.change(screen.getByPlaceholderText("Digite seu email"), {
      target: { value: "teste@email.com" },
    });

    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: /enviar código/i }))
    );

    fireEvent.change(screen.getByPlaceholderText("Código recebido"), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByPlaceholderText("Nova senha"), {
      target: { value: "Senha@123" },
    });

    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: /redefinir senha/i }))
    );

    expect(
      await screen.findByText("Erro ao redefinir senha")
    ).toBeInTheDocument();
  });
});
