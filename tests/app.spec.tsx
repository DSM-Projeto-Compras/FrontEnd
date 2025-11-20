import { useRouter } from "next/navigation";
import Home from "../app/page";
import { render } from "@testing-library/react";

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("next/navigation", () => ({useRouter: jest.fn()}));

describe("App rendering", () => {
    it("should render app and call router pages/login", async () => {
        const pushMock = jest.fn();

        (useRouter as jest.Mock).mockReturnValue({push: pushMock});

        render(<Home />)

        expect(pushMock).toHaveBeenCalledWith("/pages/login");
    })
})