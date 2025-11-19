import { render, screen, fireEvent, act } from "@testing-library/react";
import '@testing-library/jest-dom'
import ChangePasswordPage from "../../../app/pages/change-password/page";
import AuthService from "../../../app/services/authService";

jest.mock("../../../app/services/authService");

describe("Change Password Page Elements", () => {
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
});
