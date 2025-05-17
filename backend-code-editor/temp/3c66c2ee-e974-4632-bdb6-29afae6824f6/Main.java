import java.util.Scanner;
public class Main {
 public static void main(String[] args) {
 Scanner scanner = new Scanner(System.in);
 System.out.print("Enter two numbers: ");
 int a = scanner.nextInt();
 int b = scanner.nextInt();
 System.out.println("Sum is: " + (a + b));
 scanner.close();
 }
}